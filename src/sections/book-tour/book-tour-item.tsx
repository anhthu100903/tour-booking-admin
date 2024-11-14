import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { ColorPreview } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export type BookTourItemProps = {
  id: string;
  name: string;
  price: number;
  status: string;
  coverUrl: string;
  colors: string[];
  priceSale: number | null;
};

export function BookTourItem({ bookTour }: { bookTour: BookTourItemProps }) {
  const renderStatus = (
    <Label
      variant="inverted"
      color={(bookTour.status === 'sale' && 'error') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {bookTour.status}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={bookTour.name}
      src={bookTour.coverUrl}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
        }}
      >
        {bookTour.priceSale && fCurrency(bookTour.priceSale)}
      </Typography>
      &nbsp;
      {fCurrency(bookTour.price)}
    </Typography>
  );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {bookTour.status && renderStatus}

        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {bookTour.name}
        </Link>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <ColorPreview colors={bookTour.colors} />
          {renderPrice}
        </Box>
      </Stack>
    </Card>
  );
}
