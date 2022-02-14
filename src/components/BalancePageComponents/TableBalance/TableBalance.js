import { useState, useCallback } from 'react';
import { useDeleteTransactionMutation} from '../../../redux/services/transactionsAPI';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../Multipurpose-modal/Multipurpose-modal';
import { getAllTransaction } from "../../../redux/finance/finance-selectors";
import { getAccessToken } from "../../../redux/auth/auth-selectors";
import sprite from "../../../Images/sprite.svg";
import s from "./TableBalance.module.css";


const TableBalance = ({type}) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [delTransactionId, setDelTransactionId] = useState('init state');
  console.log(delTransactionId);
  const transaction = useSelector(getAllTransaction);
  const accessToken = useSelector(getAccessToken);
  const [removeTransaction] = useDeleteTransactionMutation();
  const onOpenModal = useCallback((e) => {
    setDelTransactionId(e.currentTarget.dataset.id);
    console.log(delTransactionId);

    setShowModal(true);
     
    
    // const selId = e.currentTarget.dataset.id;
    // const selReception = e.currentTarget.dataset.reception;
    // const selUserId = e.currentTarget.dataset.userid; 
    // console.log(selId);
    // console.log(selReception);
    // console.log(selUserId);
    
    
  },[delTransactionId])


  const onCloseModal = useCallback(() => {
    setShowModal(false);
    // setDelTransactionId('')
    console.log(delTransactionId);
  },[delTransactionId]);

  const handleDeleteTransaction = useCallback(async () => {
    try {
      const response = await removeTransaction(accessToken, delTransactionId);
      console.log(delTransactionId);
      console.log(response);
      onCloseModal();
    } catch (error) {
      console.log(error);
    }
  }, [accessToken, delTransactionId, onCloseModal, removeTransaction]);

  const expenses = transaction.filter((el) => el.isProfit === false);
  const income = transaction.filter((el) => el.isProfit === true);

  return (
    <>
      <div className={s.tableHead}>
        <table className={s.tableMain}>
          <thead className={s.tableHeader}>
            <tr>
              <th className={`${s.tableTitle} ${s.thDate}`}>дата</th>
              <th className={`${s.tableTitle} ${s.thDescr}`}>описание</th>
              <th className={`${s.tableTitle} ${s.thCtg}`}>категория</th>
              <th className={`${s.tableTitle} ${s.thSum}`}>сумма</th>
              <th className={`${s.tableTitle} ${s.thIcon}`}></th>
            </tr>
          </thead>
        </table>

        <div className={s.tableBodyScroll}>
          {type === "expense" && (
            <>
              <table className={`${s.tableMain} ${s.tableMainBody}`}>
                <tbody className={s.tableBody}>
                  {expenses.map((el) => (
                    <tr className={s.tableRow} key={el._id}>
                      <td className={s.thDate}>
                        {el.dateTransaction.substr(0, 10)}
                      </td>
                      <td className={s.tdDescr}>{el.description}</td>
                      <td className={s.thCtg}>{el.categoryName}</td>
                      <td className={`${s.tdSum} ${s.tdSumExpense}`}>
                        {`-${el.amount.toLocaleString("ru")} грн.`}
                      </td>
                      <td className={s.thIcon}>
                        <button
                          className={s.deleteBtn}
                          type='button'
                      onClick={(e) => onOpenModal(e)}
                      data-id={el._id}
                      data-reception={el.isProfit}
                      data-userid={el.userId}
                        >
                          <svg className={s.icon}>
                            <use
                              href={sprite + "#delete"}
                              alt="delete transaction"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {type === "income" && (
            <>
            <table className={`${s.tableMain} ${s.tableMainBody}`}>
            <tbody className={s.tableBody}>
              {income.map((el) => (
                <tr className={s.tableRow} key={el._id}>
                  <td className={s.thDate}>{el.dateTransaction.substr(0, 10)}</td>
                  <td className={s.tdDescr}>{el.description}</td>
                  <td className={s.thCtg}>{el.categoryName}</td>
                  <td className={s.tdSum}>
                    {`${el.amount.toLocaleString('ru')} грн.`}
                  </td>
                  <td className={s.thIcon}>
                    <button
                      className={s.deleteBtn}
                          type='button'
                      onClick={(e) => onOpenModal(e)}
                      data-id={el._id}
                      data-reception={el.isProfit}
                      data-userid={el.userId}
                        >
                          <svg className={s.icon}>
                            <use
                              href={sprite + "#delete"}
                              alt="delete transaction"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {showModal === true && (
            <Modal
              questionText = 'Вы уверены?'
              onClickApproved={handleDeleteTransaction}

              onClose={onCloseModal}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TableBalance;
