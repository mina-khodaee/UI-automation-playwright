import { useState } from 'react';

import { Grid } from '@mui/material';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------

function not(a, b) {
    return a.filter((value) => !b.includes(value));
}
function notID(a, b) {
    return a.filter(item1 => 
        !b.some(item2 => item2.id === item1.id)
    );
}
function intersection(a, b) {
    return a.filter((value) => b.includes(value));
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

export default function AccessGroupTransferList({ options, onGet, selectedAccessGroups }) {
    const { t } = useTranslate('user');
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState(notID(options, selectedAccessGroups) || []);
    const [right, setRight] = useState(selectedAccessGroups || []);
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;
    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
        onGet(right.concat(leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        onGet(not(right, rightChecked))
        setChecked(not(checked, rightChecked));
    };

    const customList = (title, items) => (
        <Card  sx={{ width: 260 }}>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                titleTypographyProps={{ variant: 'subtitle2' }}
                subheader={`${numberOfChecked(items)}/${items.length} ${t('texts.selected')}`}
            />
            <Divider />
            <List
                sx={{
                    width: 260,
                    height: 230,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items?.map((value) =>
                    <ListItemButton
                        key={value.id}
                        role="listitem"
                        onClick={handleToggle(value)}
                    >
                        <ListItemIcon >
                            <Checkbox
                                checked={checked.includes(value)}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{
                                    'aria-labelledby': value.id,
                                }}
                            />
                        </ListItemIcon>
                        <ListItemText id={value.id} primary={value.name} slotProps={{ primary: {variant: 'body1', fontSize: '14px'}}} />
                    </ListItemButton>
                )}
            </List>
        </Card>
    );

    return (
        <Grid
            container
            spacing={2}
            sx={{ justifyContent: 'center', alignItems: 'center', mt: 3 }}
        >
            <Grid>{customList(t('texts.accessGroupsChoices'), left)}</Grid>
            <Grid>
                <Grid container direction="column" sx={{ alignItems: 'center' }}>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid>{customList(t('texts.accessGroupsChosens'), right)}</Grid>
        </Grid>
    );
}
