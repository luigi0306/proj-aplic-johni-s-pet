/**
 * Classe de erro customizada para erros operacionais da aplicação.
 *
 * Permite que qualquer camada (controller, service) lance um erro com
 * status HTTP específico, que será capturado e tratado pelo handler
 * global de erros no app.ts.
 *
 * @example
 * throw new AppError('Pet não encontrado.', 404);
 * throw new AppError('ID do cliente inválido.', 400);
 */
export class AppError extends Error {
  public readonly status: number;

  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
    this.name = 'AppError';

    // Necessário para que instanceof funcione corretamente com classes que
    // estendem built-ins (Error) quando transpilado com TypeScript para ES5.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
