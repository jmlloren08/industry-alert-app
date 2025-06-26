import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Swal from "sweetalert2";

interface FlashData {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

interface PageProps {
    flash?: FlashData;
    [key: string]: unknown;
}

export default function useFlashMessages() {
    const { flash = {} } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: flash.success,
                confirmButtonText: 'OK',
                timer: 2000,
                timerProgressBar: true,
            });
        }
        if (flash.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: flash.error,
                confirmButtonText: 'OK',
                timer: 2000,
                timerProgressBar: true,
            });
        }
        if (flash.warning) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: flash.warning,
                confirmButtonText: 'OK',
                timer: 2000,
                timerProgressBar: true,
            });
        }
        if (flash.info) {
            Swal.fire({
                icon: 'info',
                title: 'Info',
                text: flash.info,
                confirmButtonText: 'OK',
                timer: 2000,
                timerProgressBar: true,
            });
        }
    }, [flash]);
}