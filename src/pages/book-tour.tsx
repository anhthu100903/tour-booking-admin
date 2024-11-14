import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BookTourView } from 'src/sections/book-tour/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Booking Tour - ${CONFIG.appName}`}</title>
      </Helmet>

      <BookTourView />
    </>
  );
}
