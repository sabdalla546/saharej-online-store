import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}
export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: AlertModalProps) => {
  const [isMounted, setIsMounter] = useState(false);

  useEffect(() => {
    setIsMounter(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <Modal
      title="Are you shure ?"
      description="This action cannot be undo"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button variant={"outline"} onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant={"destructive"} onClick={onConfirm} disabled={loading}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};
