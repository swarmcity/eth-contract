import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import 'eth-connect';

/**
 * `eth-contract`
 * A Web Component that fetches an Ethereum contracts ABI and exposes a contract instance.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class EthContract extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <eth-connect eth="{{eth}}"></eth-connect>
    `;
  }
  static get properties() {
    return {
      eth: {
        type: Object,
      },
      contractAddress: {
        type: String,
        observer: '_start'
      },
      publicKey: {
        type: String,
      },
      mainNet: {
        type: Boolean,
        value: false,
      },
      contractInstance: {
        type: Object,
        notify: true,
        reflectToAttribute: true
      },
      error: {
        type: String,
        notify: true,
        reflectToAttribute: true
      },
      abi: {
        type: Object,
      }
    };
  }

  _start(){
    if(!this.abi && this.contractAddress){
      this.abi = this._fetchAbi(this.contractAddress)
    } else if (this.abi && this.contractAddress){
      this.abi = this.abi;
    } else {
      this.error = "abi and or contract address not supplied"
    }
    // TODO ensure this gets called after the above 
    if(this.publicKey){
      this.contractInstance = this.eth.contract(abi).at(this.publicKey);
    } else {
      this.contractInstance = this.eth.contract(abi);
    }
  }

  _fetchAbi(address){
    return new Promise((resolve, reject) => {
      let net = '';
      if(this.mainNet){
        net = 'api';
      } else {
        net = 'ropsten';
      }
      fetch(`https://${net}.etherscan.io/api?module=contract&action=getabi&address=${address}`)
      .then((response) => {
        resolve(response.json());
      })
      .catch((error) => {
        this.error = error;
        reject(error);
      });
    })
  }

} window.customElements.define('eth-contract', EthContract);
