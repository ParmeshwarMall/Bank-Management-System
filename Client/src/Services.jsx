import Navbar from './Navbar';

export default function Services(){
    return(
        <div>
            <Navbar/>

            <div className="container10">
                <h1 className="serhead">Our Services</h1>
                <h6>At Bharat Bank, we are committed to providing a comprehensive range of financial products and services to meet the diverse needs of our customers. Whether you're an individual looking for personal banking solutions or a business seeking specialized financial services, we have you covered.</h6>

                <h2>Personal Banking:</h2>
                <ul>
                    <li><h6>Savings Accounts: Choose from a variety of savings accounts tailored to help you achieve your financial goals, whether it's saving for the future, buying your dream home, or planning for retirement.</h6></li>
                    <li><h6>Checking Accounts: Enjoy convenient and flexible checking account options with features such as online and mobile banking, debit cards, and overdraft protection.</h6></li>
                    <li><h6>Loans and Mortgages: Access competitive loan and mortgage options designed to meet your borrowing needs, including personal loans, home loans, auto loans, and more.</h6></li>
                    <li><h6>Credit Cards: Take advantage of our range of credit card options with competitive rates, rewards programs, and added benefits to suit your lifestyle and spending habits.</h6></li>
                    <li><h6>nvestment Services: Explore investment opportunities and wealth management solutions to grow your assets and secure your financial future.</h6></li>
                </ul>

                <h2>Business Banking:</h2>
                <ul>
                    <li><h6>Business Accounts: Manage your business finances efficiently with our range of business checking and savings accounts, designed to meet the unique needs of businesses of all sizes.</h6></li>
                    <li><h6>Commercial Loans: Access flexible financing solutions to support your business growth, whether it's funding expansion projects, purchasing equipment, or managing cash flow.</h6></li>
                    <li><h6>Merchant Services: Streamline your payment processing and enhance your business operations with our merchant services, including credit card processing, point-of-sale solutions, and online payment gateways.</h6></li>
                    <li><h6>Treasury Management: Optimize your cash flow and improve your financial efficiency with our treasury management services, including cash management, liquidity solutions, and risk management strategies.</h6></li>
                    <li><h6>Business Advisory: Benefit from our expert financial advice and business consulting services to help you make informed decisions and achieve your business objectives.</h6></li>
                </ul>

                <h2>Digital Banking:</h2>
                <ul>
                    <li><h6>Online Banking: Access your accounts, manage transactions, and pay bills conveniently from anywhere with our secure online banking platform.</h6></li>
                    <li><h6>Mobile Banking: Stay connected to your finances on the go with our mobile banking app, featuring mobile deposit, account alerts, and easy fund transfers.</h6></li>
                    <li><h6>Digital Wallet: Simplify your payments with our digital wallet solutions, allowing you to make secure purchases in-store, online, or through mobile devices.</h6></li>
                </ul>
            </div>
        </div>
    )
}