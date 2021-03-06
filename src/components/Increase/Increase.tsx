/* eslint-disable no-console */
/* eslint-disable no-shadow */
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType } from '@airgap/beacon-sdk';

import { useState } from 'react';
import styles from './Increase.module.scss';

import Button from '../Button';
import { useWalletStateContext } from '../../contexts/WalletContext';
import Title from '../Title';
import Progress from '../Progress';

const sendContractAddress = 'KT1B6WTvKkSZmW2882VVwQKuoxf2ubUoqgNZ';
const approveContractAddress = 'KT1LmBK9q9KqpqCPdXuFWMYzB7a2RXaq4Htn';

const network = NetworkType.HANGZHOUNET;
const rpcUrl = 'https://hangzhounet.api.tez.ie';
const wallet = new BeaconWallet({
  preferredNetwork: network,
  name: 'some name',
});
const Tezos = new TezosToolkit(rpcUrl);
let activeAccount: any;
function Increase() {
  const { tokens } = useWalletStateContext();

  const [loading, setLoading] = useState(false);

  // let activeAccount: any;

  const approve = async () => {
    try {
      if (!activeAccount) {
        await wallet.requestPermissions({ network: { type: network } });

        activeAccount = await wallet.client.getActiveAccount();
        Tezos.setWalletProvider(wallet);
      }

      // eslint-disable-next-line no-shadow
      const approve = await Tezos.wallet.at(approveContractAddress);
      const firstOp = await approve.methods
        .approve(sendContractAddress, 0)
        .send({ fee: 10000 });
      setLoading(true);
      await firstOp.confirmation(3);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    try {
      if (!activeAccount) {
        if (!activeAccount) {
          await wallet.requestPermissions({ network: { type: network } });
          activeAccount = await wallet.client.getActiveAccount();
          Tezos.setWalletProvider(wallet);
        }
      }

      const send = await Tezos.wallet.at(sendContractAddress);
      const secondOp = await send.methods.send(0).send({ fee: 10000 });
      setLoading(true);
      await secondOp.confirmation(3);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.increase__container}>
      <Title size={20}>increase a balance</Title>
      {loading ? <Progress /> : null}
      <form action='#' className={styles.increase__form}>
        <input
          className={styles.increase__input}
          type='number'
          name='number'
          placeholder='tokens'
        />
        <input
          className={styles.increase__input}
          type='text'
          name='fee'
          placeholder='fee'
        />
        {tokens ? (
          <span className={styles.increase__allowance}>
            allowance: {tokens}
          </span>
        ) : null}

        <Button onClick={() => approve()}>APPROVE</Button>

        <Button onClick={() => send()}>SEND</Button>
      </form>
    </div>
  );
}

export default Increase;
