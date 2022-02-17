import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts'
import useWindowDimensions from '../../../hooks/useWindowDimensions'
import { getCategoryItems } from '../../../redux/report/report-selectors';
import { useSelector } from 'react-redux';
import style from './Chart.module.css'

export default function Chart() { 

    const viewPort = useWindowDimensions();
    const list = useSelector(getCategoryItems);
    const data = [...list].map(item => {
        return {
            count: item.count,
            totalAmount: item.totalAmount,
            _id: item._id,
            amount: item.totalAmount + ' грн' 
        }      
    })
    let containerWidth = '90%'
    if (viewPort.width >= 1279) {
        containerWidth = '70%'
    } 
    const colors = [
         '#FF751D','#FFDAC0'
    ]
    

    return (
        <div className={style.container}>
          {viewPort.width > 768 ? (<ResponsiveContainer className={style.chart} width={containerWidth} height="100%">
                <BarChart data={data} margin={{ top: 30, right: 0, left: 0, bottom: 40 }}>
                    <CartesianGrid vertical={false} />
                    <YAxis hide tickCount={9} />
                    <Bar dataKey="totalAmount" fill="#FF751D" barSize={38} radius={[10, 10, 0, 0]} >
                         {
                            data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % 3 === 0  ? 0 : 1]} />
                            ))
                            }
                        <LabelList dataKey="amount" position="top" width={100} />
                        <LabelList dataKey="_id" position="bottom" width={100} />
                        </Bar>
            </BarChart>
            </ResponsiveContainer>) : ( <ResponsiveContainer className={style.chart} width="100%" minWidth={320} height="80%">
                <BarChart data={data} layout="vertical" barSize={15} margin={{ top: 50, right: 20, left: 20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" hide />
                    <Bar dataKey="totalAmount" fill="#FFFFFF">
                         <LabelList dataKey='amount' position="insideRight" offset={0} width={100} />
                        <LabelList dataKey="_id" position= "insideLeft" offset={0} width={200} />
                    </Bar>
                    <Bar dataKey="totalAmount" fill="#FF751D" radius={[0, 10, 10, 0]}>
                         {
                            data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % 3 === 0  ? 0 : 1]} />
                            ))
                            }
                       
                    </Bar>
            </BarChart>
            </ResponsiveContainer>)} 
            
        </div>

    
    )
} 