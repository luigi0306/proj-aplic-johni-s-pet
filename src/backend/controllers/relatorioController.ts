import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';

// GET /api/relatorio?de=YYYY-MM-DD&ate=YYYY-MM-DD
// Sem os parâmetros, usa o mês corrente.
export const gerarRelatorio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const de = (req.query.de as string) || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const ate = (req.query.ate as string) || new Date().toISOString().split('T')[0];

  try {
    const [
      faturamentoVendas,
      faturamentoAgendamentos,
      vendasPorCategoria,
      gastoInsumos,
      despesasPorCategoria,
    ] = await Promise.all([
      db.query(
        `SELECT COALESCE(SUM(valor_total), 0) AS total FROM venda WHERE data_venda BETWEEN $1 AND $2`,
        [de, ate]
      ),
      db.query(
        `SELECT COALESCE(SUM(valor_total), 0) AS total FROM agendamento
         WHERE status = 'Concluído' AND data_agendamento BETWEEN $1 AND $2`,
        [de, ate]
      ),
      db.query(
        `SELECT p.secao AS categoria, COALESCE(SUM(vp.quantidade * vp.preco_unitario), 0) AS total
         FROM venda_produto vp
         JOIN produto p ON p.id_produto = vp.id_produto
         JOIN venda v ON v.id_venda = vp.id_venda
         WHERE v.data_venda BETWEEN $1 AND $2
         GROUP BY p.secao
         ORDER BY total DESC`,
        [de, ate]
      ),
      db.query(
        `SELECT COALESCE(SUM(ui.quantidade_usada * i.custo_unitario), 0) AS total
         FROM uso_insumo ui
         JOIN insumos i ON i.id_insumo = ui.id_insumo
         WHERE ui.data_uso BETWEEN $1 AND $2`,
        [de, ate]
      ),
      db.query(
        `SELECT categoria, COALESCE(SUM(valor), 0) AS total
         FROM despesa
         WHERE data BETWEEN $1 AND $2
         GROUP BY categoria
         ORDER BY total DESC`,
        [de, ate]
      ),
    ]);

    const faturamento =
      Number(faturamentoVendas.rows[0].total) + Number(faturamentoAgendamentos.rows[0].total);

    const gastosInsumos = Number(gastoInsumos.rows[0].total);
    const gastosDespesas = despesasPorCategoria.rows.reduce(
      (soma: number, r: any) => soma + Number(r.total),
      0
    );
    const gastos = gastosInsumos + gastosDespesas;

    res.json({
      periodo: { de, ate },
      faturamento,
      gastos,
      lucro: faturamento - gastos,
      vendasPorCategoria: vendasPorCategoria.rows.map((r: any) => ({
        categoria: r.categoria,
        total: Number(r.total),
      })),
      despesasPorCategoria: [
        ...despesasPorCategoria.rows.map((r: any) => ({ categoria: r.categoria, total: Number(r.total) })),
        { categoria: 'Insumos (consumo)', total: gastosInsumos },
      ],
    });
  } catch (error) {
    next(error);
  }
};
