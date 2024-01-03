import { Modal, ModalFuncProps } from 'antd';
import clsx from 'clsx';

export function showModal(props?: ModalFuncProps) {
  Modal.confirm({
    centered: true,
    icon: false,
    closable: true,
    ...props,
    wrapClassName: clsx('utils-modal', props?.wrapClassName),
  });
}
