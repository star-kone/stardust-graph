import {SDAirdrop, Token} from "../generated/schema"
import {convertTokenToDecimal} from "./helpers";
import {Claimed, Deposited, Withdrawn} from "../generated/SDFactory/SDAirdrop";
import {BigInt, Bytes} from "@graphprotocol/graph-ts";

export function handleDeposited(event: Deposited): void {

    let airdrop = SDAirdrop.load(event.address.toHex());
    if (airdrop == null) return
    let token = Token.load(airdrop.token);
    if (token == null) return;
    let decimals = BigInt.fromI32(token.decimals);
    airdrop.balance = airdrop.balance.plus(convertTokenToDecimal(event.params.depositAmount, decimals));
    airdrop.claimAmount = convertTokenToDecimal(event.params.claimAmount, decimals);
    airdrop.save();
}

export function handleWithdrawn(event: Withdrawn): void {

    let airdrop = SDAirdrop.load(event.address.toHex());
    if (airdrop == null) return
    let token = Token.load(airdrop.token);
    if (token == null) return;
    airdrop.balance = airdrop.balance.minus(convertTokenToDecimal(event.params.amount, BigInt.fromI32(token.decimals)));
    airdrop.save();
}

export function handleClaimed(event: Claimed): void {

    let airdrop = SDAirdrop.load(event.address.toHex());
    if (airdrop == null) return
    let token = Token.load(airdrop.token);
    if (token == null) return;
    airdrop.balance = airdrop.balance.minus(convertTokenToDecimal(event.params.amount, BigInt.fromI32(token.decimals)));
    airdrop.save();
}








