import React from "react"
import { Modal, ModalOverlay } from "@chakra-ui/react"



interface IProps {
    open: boolean;
    close: any;
    size?: string | undefined;
    children: React.ReactNode
}

const Dialog: React.FC<IProps> = ({ open, close, size = "sm", children }) => {
    return (
        <Modal size={size} scrollBehavior="inside" isCentered={true}
            isOpen={open} onClose={close}>
            <ModalOverlay>
                {children}
            </ModalOverlay>
        </Modal>
    );
}

export default Dialog