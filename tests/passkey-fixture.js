import { Encoder } from 'cbor-x';
const cbor = new Encoder({ useRecords: false, mapsAsObjects: false, tagUint8Array: false });
const utf8 = value => new TextEncoder().encode(value);
const b64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const unb64 = value => Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')), c => c.charCodeAt(0));
const hash = async value => new Uint8Array(await crypto.subtle.digest('SHA-256', value));
function concat(...items) { const out = new Uint8Array(items.reduce((n,x)=>n+x.length,0)); let i=0; for(const item of items){out.set(item,i);i+=item.length;} return out; }
function count(value) { const out=new Uint8Array(4);new DataView(out.buffer).setUint32(0,value);return out; }
function der(raw) {
  const integer = input => { let value=input;while(value.length>1&&value[0]===0)value=value.slice(1);if(value[0]&128)value=concat(new Uint8Array([0]),value);return concat(new Uint8Array([2,value.length]),value); };
  const body=concat(integer(raw.slice(0,32)),integer(raw.slice(32)));
  return concat(new Uint8Array([0x30,body.length]),body);
}
// A protocol-level authenticator fixture signs real challenges with a fresh P-256
// key. It exercises server verification without a browser or biometric device.
export async function authenticator() {
  const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
  const jwk=await crypto.subtle.exportKey('jwk',pair.publicKey);
  const idBytes=crypto.getRandomValues(new Uint8Array(32));
  const id=b64(idBytes);let counter=0;
  return {
    id,
    async register(options, { origin='https://trip.example.test', uv=true }={}) {
      const cose=cbor.encode(new Map([[1,2],[3,-7],[-1,1],[-2,unb64(jwk.x)],[-3,unb64(jwk.y)]]));
      const authData=concat(await hash(utf8(options.rp.id)),new Uint8Array([uv?0x45:0x41]),count(0),new Uint8Array(16),new Uint8Array([0,idBytes.length]),idBytes,cose);
      return {id,rawId:id,type:'public-key',clientExtensionResults:{},response:{clientDataJSON:b64(utf8(JSON.stringify({type:'webauthn.create',challenge:options.challenge,origin}))),attestationObject:b64(cbor.encode(new Map([['fmt','none'],['attStmt',new Map()],['authData',authData]]))),transports:['internal']}};
    },
    async authenticate(options, { origin='https://trip.example.test', uv=true, rpID=options.rpId }={}) {
      const clientData=utf8(JSON.stringify({type:'webauthn.get',challenge:options.challenge,origin}));
      const authData=concat(await hash(utf8(rpID)),new Uint8Array([uv?5:1]),count(++counter));
      const signature=new Uint8Array(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},pair.privateKey,concat(authData,await hash(clientData))));
      return {id,rawId:id,type:'public-key',clientExtensionResults:{},response:{clientDataJSON:b64(clientData),authenticatorData:b64(authData),signature:b64(der(signature)),userHandle:null}};
    },
  };
}
