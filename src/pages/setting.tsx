import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SystemSettingsView} from 'src/sections/setting'

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Cài đặt hệ thống - ${CONFIG.appName}`}</title>
      </Helmet>

      <SystemSettingsView />
    </>
  );
}
