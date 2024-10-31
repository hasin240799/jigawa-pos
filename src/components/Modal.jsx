import React from 'react';
import { Dialog } from 'primereact/dialog';

const Modal = ({ visible, setVisible, children,title,footer }) => {
    return (
        <Dialog
            header={title}
            visible={visible}
            style={{ width: '70%' }}
            className="justify-content-center h-auto"
            onHide={() => setVisible(false)}
            footer={footer} // Empty footer
        >
            {children}
            {/* Content inside the Dialog is removed */}
        </Dialog>
    );
};

export default Modal;
