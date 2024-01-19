import './App.less';
import { PageRouter } from 'routes';
import ScrollToTop from 'components/ScrollToTop';
import Header from 'components/Header';
import Footer from 'components/Footer';
import PageLoading from 'components/PageLoading';
// import { Suspense } from 'react';
function App() {
  return (
    <>
      {/* <Modals /> */}
      {/* <Suspense fallback={null}> */}
      <Header />
      <ScrollToTop />
      <div className="page-container">
        <PageRouter />
        <Footer />
      </div>
      <PageLoading />
      {/* </Suspense> */}
    </>
  );
}

export default App;
