import { Grid, Box, Skeleton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

// ----------------------------------------------------------------------

export function DeviceUserDetailSkeleton() {
    return (
        <Grid item xs={12} md={11} lg={12}>
            <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
                <Skeleton variant="rectangular" sx={{ width: 80, height: 32 }} />
            </Box>

            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Skeleton sx={{ height: 24, width: 120 }} />
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <Skeleton sx={{ height: 16, width: 140, mb: 1 }} />
                    <Skeleton sx={{ height: 16, width: 140 }} />
                </Box>
            </Box>

            <Skeleton variant="rectangular" sx={{ height: 1, my: 2 }} />

            <Box
                display="grid"
                rowGap={4}
                columnGap={1}
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                }}
                sx={{ mt: 4 }}
            >
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} sx={{ height: 20, width: 160 }} />
                ))}
            </Box>

            <Box sx={{ my: 4, display: 'flex', alignItems: 'center' }}>
                <Skeleton sx={{ height: 20, width: 100, mr: 2 }} />
                {[...Array(3)].map((_, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Skeleton variant="circular" sx={{ width: 8, height: 8, mr: 1 }} />
                        <Skeleton sx={{ height: 16, width: 80 }} />
                    </Box>
                ))}
            </Box>


            <TableContainer sx={{ maxHeight: 300, maxWidth: 400 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell><Skeleton sx={{ height: 16, width: 60 }} /></TableCell>
                            <TableCell><Skeleton sx={{ height: 16, width: 60 }} /></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(3)].map((_, index) => (
                            <TableRow key={index}>
                                <TableCell><Skeleton sx={{ height: 16, width: 40 }} /></TableCell>
                                <TableCell><Skeleton sx={{ height: 16, width: 40 }} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TableContainer sx={{ maxHeight: 300, maxWidth: 400 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {[...Array(3)].map((_, i) => (
                                <TableCell key={i}><Skeleton sx={{ height: 16, width: 60 }} /></TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(3)].map((_, index) => (
                            <TableRow key={index}>
                                {[...Array(3)].map((__, i) => (
                                    <TableCell key={i}><Skeleton sx={{ height: 16, width: 60 }} /></TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
}        