import { Client } from 'pg';

async function runTests() {
  const baseUrl = 'http://localhost:3000/api';

  console.log('--- STARTING VALIDATION AND API TESTS ---');

  // Test 1: Create client with invalid data (validation check)
  console.log('\n[Test 1] Creating a client with invalid data...');
  try {
    const res = await fetch(`${baseUrl}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpf: '123', // invalid length
        nome: '', // too short
        telefone: '12345',
        endereco: 'A'
      })
    });
    const data = await res.json();
    console.log('Response Status:', res.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    if (res.status === 400 && data.error === 'Erro de validação') {
      console.log('✅ Test 1 Passed: validation correctly caught the errors.');
    } else {
      console.log('❌ Test 1 Failed: unexpected response.');
    }
  } catch (err) {
    console.error('Test 1 Error:', err);
  }

  // Test 2: Create client with valid data
  console.log('\n[Test 2] Creating a client with valid data...');
  let createdClientId: number | null = null;
  const testCpf = '123.456.789-00';
  const testNome = 'Isaac Newton';
  const testTelefone = '(11) 98765-4321';
  const testEndereco = 'Rua das Maças, 42';

  try {
    const res = await fetch(`${baseUrl}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpf: testCpf,
        nome: testNome,
        telefone: testTelefone,
        endereco: testEndereco
      })
    });
    const data = await res.json() as any;
    console.log('Response Status:', res.status);
    console.log('Created Client:', data);
    if (res.status === 201 || res.status === 200) {
      createdClientId = data.id_cliente;
      console.log('✅ Test 2 Passed: client created successfully with ID:', createdClientId);
    } else {
      console.log('❌ Test 2 Failed.');
    }
  } catch (err) {
    console.error('Test 2 Error:', err);
  }

  if (!createdClientId) {
    console.log('Skipping further tests as client creation failed.');
    return;
  }

  // Test 3: Partial update on client (verify existing fields are NOT overwritten)
  console.log('\n[Test 3] Updating only the phone number of the client...');
  const newTelefone = '(11) 99999-9999';
  try {
    const res = await fetch(`${baseUrl}/clientes/${createdClientId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telefone: newTelefone
      })
    });
    const data = await res.json() as any;
    console.log('Response Status:', res.status);
    console.log('Updated Client:', data);
    if (
      res.status === 200 &&
      data.telefone === newTelefone &&
      data.nome === testNome &&
      data.cpf === testCpf &&
      data.endereco === testEndereco
    ) {
      console.log('✅ Test 3 Passed: partial update succeeded and preserved other fields.');
    } else {
      console.log('❌ Test 3 Failed: fields were lost or overwritten.');
    }
  } catch (err) {
    console.error('Test 3 Error:', err);
  }

  // Test 4: Create pet with invalid enum values
  console.log('\n[Test 4] Creating a pet with invalid enum values...');
  try {
    const res = await fetch(`${baseUrl}/pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Thor',
        raca: 'Golden Retriever',
        porte: 'Gigante', // Invalid enum value
        faixa_etaria: 'Bebê', // Invalid enum value
        hist_medico: 'Nenhum',
        id_cliente: createdClientId
      })
    });
    const data = await res.json();
    console.log('Response Status:', res.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    if (res.status === 400 && data.error === 'Erro de validação') {
      console.log('✅ Test 4 Passed: invalid pet enums caught by validation.');
    } else {
      console.log('❌ Test 4 Failed.');
    }
  } catch (err) {
    console.error('Test 4 Error:', err);
  }

  // Test 5: Create pet with valid data
  console.log('\n[Test 5] Creating a pet with valid data...');
  let createdPetId: number | null = null;
  try {
    const res = await fetch(`${baseUrl}/pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Thor',
        raca: 'Golden Retriever',
        porte: 'Grande',
        faixa_etaria: 'Adulto',
        hist_medico: 'Nenhum',
        id_cliente: createdClientId
      })
    });
    const data = await res.json() as any;
    console.log('Response Status:', res.status);
    console.log('Created Pet:', data);
    if (res.status === 201 || res.status === 200) {
      createdPetId = data.id_pet;
      console.log('✅ Test 5 Passed: pet created successfully with ID:', createdPetId);
    } else {
      console.log('❌ Test 5 Failed.');
    }
  } catch (err) {
    console.error('Test 5 Error:', err);
  }

  // Clean up test data
  console.log('\n--- CLEANING UP TEST DATA ---');
  const pgClient = new Client({
    connectionString: 'postgres://postgres:postgrespassword@localhost:5432/petshop'
  });
  try {
    await pgClient.connect();
    if (createdPetId) {
      await pgClient.query('DELETE FROM pet WHERE id_pet = $1', [createdPetId]);
      console.log('Deleted test pet');
    }
    if (createdClientId) {
      await pgClient.query('DELETE FROM cliente WHERE id_cliente = $1', [createdClientId]);
      console.log('Deleted test client');
    }
    console.log('✅ Cleanup completed.');
  } catch (err) {
    console.error('Cleanup Error:', err);
  } finally {
    await pgClient.end();
  }
}

runTests();
