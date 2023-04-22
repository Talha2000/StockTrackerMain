import React, {useContext, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import {StockContext} from '../context/stockContext'
import { AuthContext } from '../context/authContext'
import StockInfo from '../components/StockInfo/StockInfo'
import Overview from '../components/Overview/Overview'
import Chart from '../components/Chart/Chart'
import Search from '../components/Search/Search'
import Options from '../components/Options/Options'
import CompanyNews from '../components/News/CompanyNews'
import { chartConfig } from '../constants/config'
import { useNavigate } from 'react-router-dom'
const DashBoard = () => {
  const {stockSymbol, setStockSymbol, companyDetails, setQuote, quote, stockQuote, companyNews, getStocks, stockList} = useContext(StockContext);
  const {currentUser} = useContext(AuthContext);
  const [stockDetails, setStockDetails] = useState({});
  const { stockName } = useParams();

  const [news, setNews] = useState([]);
  const navigate = useNavigate();
  
  const formatDate = () => {
    const endDateString = new Date();
    const startDateString = new Date();
    startDateString.setMonth(endDateString.getMonth() - 1);

    const startDate = startDateString.toISOString().slice(0, 10); // e.g. "2022-04-09"
    const endDate = endDateString.toISOString().slice(0, 10); // e.g. "2023-04-09"
    return {startDate, endDate};
  };

  //If there is any change in the stockSymbol, this hook is called
  useEffect(() => { 
    if (stockName !== undefined) {
      setStockSymbol(stockName);
    }
    console.log("called dashboard")
    // get all the stocks the user has already BookMarked from the userStocks table
    const getInfo = async () => {
      try {
        console.log("getInfo called")

          await(getStocks());
          console.log("getStocks done")
      }
      catch (exception) {
          console.log(exception)
      };
    };

    const getCompanyData = async () => {
      try {
        console.log("getCompanyData called")
        const {startDate, endDate } = await formatDate();
        const responseDetails = await companyDetails(stockSymbol);
        setStockDetails(responseDetails);
        const responseQuote = await stockQuote(stockSymbol);
        setQuote(responseQuote);
        const responseNews = await companyNews(stockSymbol, startDate, endDate);
        setNews(responseNews);
      } catch (error) {
        setStockDetails({});
        setQuote({});
        setNews([]);
        console.log(error)
      };
    };
    getInfo();
    getCompanyData();
    
    const interval = setInterval(() => {
      getCompanyData(); // call the API every 5 minutes
    }, 5 * 60 * 1000);
    return () => clearInterval(interval); // clean up the interval
  }, [stockSymbol, currentUser, navigate]); // stockSymbol is the dependency for the useEffect

  return (
    <div className='text-white pb-20 pt-10 h-screen w-screen grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-8 md:grid-rows-7 xl:grid-rows-5 auto-rows-fr gap-6 p-10 font-quicksand bg-mainBg'>
      <div className="col-span-1 md:col-span-2 xl:col-span-3 row-span-1 flex justify-start items-center transition-opacity duration-1000">
       <Search/>
      </div>

      <div className="">
       <Overview 
       symbol={stockSymbol} 
       price={quote.pc}
       change={quote.d} 
       changePercent={quote.dp} 
       currency={stockDetails.currency}/>
      </div>

      <div className="md:col-span-2 row-span-3">
        <Chart/>
      </div>

      <div className="row-span-2 xl:row-span-3">
        <StockInfo data={stockDetails}/>
      </div>

      <div className="">
       <Options data={stockList} user={currentUser}/>
      </div>

      <div className="">
       <CompanyNews info={news}/>
      </div>
    </div>
  )
}

export default DashBoard