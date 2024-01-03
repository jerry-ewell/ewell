export function pageToTop(options: ScrollToOptions = { top: 0, behavior: 'smooth' }) {
  window.document.getElementsByClassName('page-container')?.[0].scrollTo(options);
}
