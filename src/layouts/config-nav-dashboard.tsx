import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard Tổng Quan',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Quản lý Tour',
    path: '/tour',
    icon: icon('ic-blog'),
    
  },
  {
    title: 'Quản lý Đặt Tour',
    path: '/booking-tour',
    icon: icon('ic-book-tour'),
  },
  {
    title: 'Quản lý khách hàng',
    path: '/user',
    icon: icon('ic-user'),
   
  },
  {
    title: 'Cài Đặt Hệ Thống',
    path: '/setting',
    icon: icon('ic-system'),
  },
];
