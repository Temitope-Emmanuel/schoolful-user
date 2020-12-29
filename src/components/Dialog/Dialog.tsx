import React from "react"
import { Modal, ModalOverlay } from "@chakra-ui/react"
import {createStyles,makeStyles,Theme} from "@material-ui/core/styles"

const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{

    }
}))



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