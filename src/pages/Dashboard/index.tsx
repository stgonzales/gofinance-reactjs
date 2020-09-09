import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';


import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      //[x] Carregar as transacoes em uma variavel
      const response = await api.get<any>(`transactions`)
      const rawTransactionsData = response.data.transactions;
      const rawBalanceData = response.data.balance;

      const formatedTransactionsData: Transaction[] = [];

      //[x] Format value
      //[x] Format Date
      rawTransactionsData.forEach((transaction: any) => {
        const formatedTransaction: Transaction = {
          id: transaction.id,
          title: transaction.title,
          value: transaction.value,
          formattedValue: formatValue(transaction.value),
          formattedDate: formatDate(new Date(transaction.created_at)),
          type: transaction.type,
          created_at: transaction.created_at,
          category: transaction.category,
        }

        formatedTransactionsData.push(formatedTransaction)
      });

      const formatedBalance: Balance = {
        income: formatValue(rawBalanceData.income),
        outcome: formatValue(rawBalanceData.outcome),
        total: formatValue(rawBalanceData.total),

      }

      setTransactions([...formatedTransactionsData]);
      setBalance(formatedBalance);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {/* [x]Setar cada transacao em seu campo */}
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>{transaction.type === "outcome" ? `- ${transaction.formattedValue}` : transaction.formattedValue}</td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
