type Props = {
  message: string;
  onClose: () => void;
};

export const ErrorModal = ({ message, onClose }: Props) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
      <h2 className="text-xl font-bold mb-4">Erro</h2>
      <p className="mb-4">{message}</p>
      <button
        onClick={onClose}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Fechar
      </button>
    </div>
  </div>
);
