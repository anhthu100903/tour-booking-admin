import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AccountView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Quản lý Account - ${CONFIG.appName}`}</title>
      </Helmet>

      <AccountView />
    </>
  );
}
