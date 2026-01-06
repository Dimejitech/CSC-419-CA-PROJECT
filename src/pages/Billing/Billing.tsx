import React from 'react';
import styles from './Billing.module.css';
import { Button } from '../../components';

interface Invoice {
  id: string;
  invoiceId: string;
  description: string;
  date: string;
  amount: string;
}

interface Payment {
  id: string;
  paymentId: string;
  method: string;
  amount: string;
}

const outstandingBalance = '₦120,000';

const recentInvoices: Invoice[] = [
  {
    id: '1',
    invoiceId: '#00258',
    description: 'For diabetes management',
    date: 'April 19, 2025',
    amount: '₦50,000',
  },
  {
    id: '2',
    invoiceId: '#00258',
    description: 'Annual Check-up',
    date: 'Feb 10, 2025',
    amount: '₦100,000',
  },
  {
    id: '3',
    invoiceId: '#00258',
    description: 'Cardiology Consultation',
    date: 'January 20, 2025',
    amount: '₦50,000',
  },
  {
    id: '4',
    invoiceId: '#00258',
    description: 'Amlodipine 500mg',
    date: 'April 19, 2025',
    amount: '₦20,000',
  },
  {
    id: '5',
    invoiceId: '#00258',
    description: 'For diabetes management',
    date: 'April 19, 2025',
    amount: '₦50,000',
  },
];

const paymentHistory: Payment[] = [
  {
    id: '1',
    paymentId: '#00258',
    method: 'Credit Card',
    amount: '₦50,000',
  },
  {
    id: '2',
    paymentId: '#00258',
    method: 'Credit Card',
    amount: '₦50,000',
  },
  {
    id: '3',
    paymentId: '#00258',
    method: 'Online Payment',
    amount: '₦50,000',
  },
  {
    id: '4',
    paymentId: '#00258',
    method: 'Credit Card',
    amount: '₦50,000',
  },
  {
    id: '5',
    paymentId: '#00258',
    method: 'Credit Card',
    amount: '₦50,000',
  },
];

export const Billing: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Billing</h1>
      </div>

      {/* Outstanding Balance Card */}
      <div className={styles.balanceCard}>
        <div className={styles.balanceInfo}>
          <span className={styles.balanceLabel}>Outstanding Balance</span>
          <span className={styles.balanceAmount}>{outstandingBalance}</span>
        </div>
        <Button>Pay Now</Button>
      </div>

      {/* Two Column Layout */}
      <div className={styles.columnsContainer}>
        {/* Recent Invoices */}
        <div className={styles.tableCard}>
          <h3 className={styles.tableTitle}>Recent Invoices</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className={styles.invoiceId}>{invoice.invoiceId}</td>
                  <td>
                    <div className={styles.descriptionCell}>
                      <span>{invoice.description}</span>
                      <span className={styles.dateText}>{invoice.date}</span>
                    </div>
                  </td>
                  <td className={styles.amountRed}>{invoice.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <a href="#" className={styles.viewAllLink}>View All Invoices &gt;&gt;</a>
        </div>

        {/* Payment History */}
        <div className={styles.tableCard}>
          <h3 className={styles.tableTitle}>Payment History</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Method</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td className={styles.paymentId}>{payment.paymentId}</td>
                  <td>{payment.method}</td>
                  <td className={styles.amountBlack}>{payment.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <a href="#" className={styles.viewAllLink}>View All Payments &gt;&gt;</a>
        </div>
      </div>
    </div>
  );
};

export default Billing;
