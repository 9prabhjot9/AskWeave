import React, { useState } from 'react';
import { sendTip, getBalance, ARDRIVE_WALLET_ADDRESS } from '../lib/weavedb';
import { useWallet } from '../contexts/WalletContext';

interface TipButtonProps {
  className?: string;
}

const TipButton: React.FC<TipButtonProps> = ({ className }) => {
  const [amount, setAmount] = useState<string>('0.1');
  const [isTipping, setIsTipping] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { walletAddress } = useWallet();

  const handleTip = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    setIsTipping(true);
    try {
      const result = await sendTip(walletAddress, parseFloat(amount));
      if (result.success) {
        alert(`Tip sent successfully! Transaction ID: ${result.txId}`);
      } else {
        alert('Failed to send tip. Please try again.');
      }
    } catch (error) {
      console.error('Error sending tip:', error);
      alert('An error occurred while sending the tip.');
    } finally {
      setIsTipping(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg ${className}`}
      >
        Tip AR
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Send Tip</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (AR)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0.000000000001"
                step="0.1"
              />
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Tip will be sent to: <span className="font-mono text-xs break-all">{ARDRIVE_WALLET_ADDRESS}</span>
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleTip}
                disabled={isTipping}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isTipping ? 'Sending...' : 'Send Tip'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TipButton; 