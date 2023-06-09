import React, { useContext } from 'react'
import Card from '../Card/Card'
import { motion, AnimatePresence  } from "framer-motion"
import { ThemeContext } from '../../context/themeContext';

const StockInfo = ({data}) => {
    const {darkMode} = useContext(ThemeContext);
    
    const dataList = {
        name: "Name",
        country: "Country",
        currency: "Currency",
        exchange: "Exchange",
        marketCapitalization: "Market Capitilization",
        finnhubIndustry: "Industry"
    }

    const convertValue = (number) => {
        return (number / 1000).toFixed(2);
    }

    return (
        <Card>
            <ul className={`pr-2 w-full h-full flex flex-col justify-between divide-y-1 overflow-y-scroll custom-scrollbar xl:pr-0
                            ${darkMode ? "divide-white" : "divide-black"}`}>
                {Object.keys(dataList).map((item, index) => {
                    return (
                    <AnimatePresence key={item}>
                        <motion.li 
                            className=' flex-1 flex justify-between items-center'
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.3, staggerChildren: 0.5 }}
                        >

                            <motion.span className='font-medium flex justify-items-end'>
                                {dataList[item]}
                            </motion.span>

                            <motion.span className='font-medium'>
                                {item === "marketCapitalization"
                                ? `${convertValue(data[item])}B`
                                : data[item]}
                            </motion.span>

                        </motion.li>
                    </AnimatePresence>
                    );
                })}
            </ul>
        </Card>
     );
};

export default StockInfo