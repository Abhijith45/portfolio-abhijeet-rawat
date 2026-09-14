import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
    Box,
    Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const ConfirmDeleteDialog = ({
    open,
    onClose,
    onConfirm,
    title = 'Confirm Deletion',
    description = 'Are you sure you want to permanently delete this item? This action cannot be undone.',
    itemName,
    itemCount,
    loading = false,
}) => {
    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    background: '#0a0a0f',
                    border: '1px solid rgba(255, 77, 79, 0.4)',
                    boxShadow: '0 0 30px rgba(255, 77, 79, 0.2)',
                    borderRadius: '12px',
                    p: 1,
                },
            }}
        >
            <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '8px',
                        background: 'rgba(255, 77, 79, 0.12)',
                        border: '1px solid rgba(255, 77, 79, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ff4d4f',
                    }}
                >
                    <WarningAmberIcon fontSize="medium" />
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.2 }}>
                        {title}
                    </Typography>
                    <Typography sx={{ color: '#ff4d4f', fontFamily: 'Fira Code, monospace', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                        // PERMANENT_REMOVAL_WARNING
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ py: 1.5 }}>
                <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {description}
                </DialogContentText>

                {itemName && (
                    <Box
                        sx={{
                            mt: 2,
                            p: 1.5,
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px dashed rgba(255, 77, 79, 0.3)',
                        }}
                    >
                        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', wordBreak: 'break-word' }}>
                            {itemName}
                        </Typography>
                    </Box>
                )}

                {itemCount && itemCount > 1 && (
                    <Box
                        sx={{
                            mt: 2,
                            p: 1.5,
                            borderRadius: '6px',
                            background: 'rgba(255, 77, 79, 0.08)',
                            border: '1px solid rgba(255, 77, 79, 0.3)',
                        }}
                    >
                        <Typography sx={{ color: '#ff4d4f', fontWeight: 700, fontSize: '0.85rem' }}>
                            {itemCount} items selected for batch deletion
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    variant="outlined"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.4)',
                            background: 'rgba(255, 255, 255, 0.04)',
                        },
                        fontSize: '0.8rem',
                        fontWeight: 600,
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={loading}
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <DeleteForeverIcon />}
                    sx={{
                        background: '#ff4d4f',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        '&:hover': {
                            background: '#ff7875',
                            boxShadow: '0 0 15px rgba(255, 77, 79, 0.5)',
                        },
                    }}
                >
                    {loading ? 'Deleting...' : 'Confirm Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;
