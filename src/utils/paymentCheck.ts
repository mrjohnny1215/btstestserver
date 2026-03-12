import { Connection, PublicKey } from '@solana/web3.js';

export async function verifySolanaPayment(
  txHash: string,
  recipientAddress: string,
  expectedAmount: number
): Promise<boolean> {
  try {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    
    const tx = await connection.getTransaction(txHash, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0
    });
    
    if (!tx || tx.meta?.err) return false;
    
    const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
    const recipientPubKey = new PublicKey(recipientAddress);
    
    const postBalances = tx.meta?.postTokenBalances || [];
    
    for (const balance of postBalances) {
      if (
        balance.mint === USDC_MINT &&
        balance.owner === recipientAddress
      ) {
        const receivedAmount = balance.uiTokenAmount?.uiAmount || 0;
        if (receivedAmount >= expectedAmount) {
          return true;
        }
      }
    }
    
    const tokenTransfers = tx.meta?.tokenTransfers || [];
    for (const transfer of tokenTransfers) {
      if (
        transfer.mint === USDC_MINT &&
        transfer.toUser === recipientAddress
      ) {
        const receivedAmount = parseFloat(transfer.amount || '0');
        if (receivedAmount >= expectedAmount) {
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('Solana verification error:', error);
    return false;
  }
}

export async function verifyTronPayment(
  txHash: string,
  recipientAddress: string,
  expectedAmount: number
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.trongrid.io/v1/transactions/${txHash}`,
      {
        headers: {
          'TRON-PRO-API-KEY': 'your-api-key'
        }
      }
    );
    
    if (!response.ok) return false;
    
    const tx = await response.json();
    
    if (tx.ret?.[0]?.contractRet !== 'SUCCESS') {
      return false;
    }
    
    const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
    
    const contract = tx.raw_data?.contract?.[0];
    if (!contract) return false;
    
    const parameter = contract.parameter?.value;
    if (!parameter) return false;
    
    if (parameter.contract_address === USDT_CONTRACT) {
      const toAddress = parameter.to_address;
      const amount = parameter.amount / 1_000_000;
      
      if (
        toAddress?.toLowerCase() === recipientAddress.toLowerCase() && 
        amount >= expectedAmount
      ) {
        return true;
      }
    }
    
    return false;
    
  } catch (error) {
    console.error('TRON verification error:', error);
    return false;
  }
}

export async function verifyPayment(
  txHash: string,
  crypto: 'USDT' | 'USDC',
  recipientAddress: string,
  expectedAmount: number
): Promise<{ success: boolean; message: string }> {
  try {
    if (crypto === 'USDC' && !/^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(txHash.trim())) {
      return { success: false, message: 'Invalid Solana TX ID format' };
    }
    if (crypto === 'USDT' && !/^[a-fA-F0-9]{64}$/.test(txHash.trim())) {
      return { success: false, message: 'Invalid TRC-20 TX Hash format' };
    }
    
    if (crypto === 'USDC') {
      const isValid = await verifySolanaPayment(txHash, recipientAddress, expectedAmount);
      return {
        success: isValid,
        message: isValid 
          ? 'Payment verified on Solana blockchain' 
          : 'Transaction not found, failed, or insufficient amount'
      };
    } else {
      const isValid = await verifyTronPayment(txHash, recipientAddress, expectedAmount);
      return {
        success: isValid,
        message: isValid 
          ? 'Payment verified on TRON blockchain' 
          : 'Transaction not found, failed, or insufficient amount'
      };
    }
  } catch (error: any) {
    console.error('Verification error:', error);
    return {
      success: false,
      message: 'Verification failed: ' + (error?.message || 'Unknown error')
    };
  }
}

export const isValidSolanaTxHash = (hash: string): boolean => {
  return /^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(hash.trim());
};

export const isValidTronTxHash = (hash: string): boolean => {
  return /^[a-fA-F0-9]{64}$/.test(hash.trim());
};

export const isValidTxHash = (hash: string, crypto: 'USDT' | 'USDC'): boolean => {
  return crypto === 'USDT' 
    ? isValidTronTxHash(hash) 
    : isValidSolanaTxHash(hash);
};