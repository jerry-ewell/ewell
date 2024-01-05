import { BrowserRouter } from 'react-router-dom';
import './App.less';
import Modals from 'modals';
import { PageRouter } from 'routes';
import ScrollToTop from 'components/ScrollToTop';
import Header from 'components/Header';
import Footer from 'components/Footer';
// import { Suspense } from 'react';
function App() {
  return (
    <>
      {/* <Modals /> */}
      {/* <Suspense fallback={null}> */}
      <BrowserRouter>
        <Header />
        <ScrollToTop />
        <div className="page-container">
          <PageRouter />
          <Footer />
        </div>
      </BrowserRouter>
      {/* </Suspense> */}
    </>
  );
}

export default App;
