import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PassengerView } from 'src/sections/passenger/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Quản lý Passenger - ${CONFIG.appName}`}</title>
      </Helmet>

      <PassengerView />
    </>
  );
}
