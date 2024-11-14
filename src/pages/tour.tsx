import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TourView } from 'src/sections/tour/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Quản lý Tour - ${CONFIG.appName}`}</title>
      </Helmet>

      <TourView />
    </>
  );
}
