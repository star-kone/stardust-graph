import {AirdropCreated, IdentifierChanged} from "../generated/SDFactory/SDFactory"
import {SDAirdrop, SDIdentifier, SDFactory, Token} from "../generated/schema"
import {FACTORY_ADDRESS, ZERO_BD} from "./helpers";
import {Airdrop as AirdropTemplate} from "../generated/templates";
import {SDIdentifier as SDIdentifierContract} from "../generated/SDFactory/SDIdentifier";
import {Token as TokenContract} from "../generated/SDFactory/Token";

export function handleAirdropCreated(event: AirdropCreated): void {

    // load or create factory
    let factory = SDFactory.load(FACTORY_ADDRESS);
    if (factory == null) {
        factory = new SDFactory(FACTORY_ADDRESS);
        factory.airdropCount = 0;
    }
    factory.airdropCount = factory.airdropCount + 1;
    factory.save();

    // create token
    let tokenId = event.params.token.toHex();
    let token = Token.load(tokenId);
    if (token == null) {
        let contract = TokenContract.bind(event.params.token);
        token = new Token(tokenId);
        token.name = contract.name();
        token.symbol = contract.symbol();
        token.decimals = contract.decimals();
        token.save();
    }

    // create airdrop
    let airdrop = new SDAirdrop(event.params.airdrop.toHex());
    airdrop.name = event.params.name;
    airdrop.token = token.id;
    airdrop.owner = event.params.owner;
    airdrop.identifier = event.params.identifier.toHex();
    airdrop.balance = ZERO_BD;
    airdrop.claimAmount = ZERO_BD;

    // create the tracked contract based on the template
    AirdropTemplate.create(event.params.airdrop);
    airdrop.save();
}

export function handleIdentifierChanged(event: IdentifierChanged): void {

    let identId = event.params.identifier.toHex();
    let ident = SDIdentifier.load(identId);
    if (ident == null) {
        let contract = SDIdentifierContract.bind(event.params.identifier);
        ident = new SDIdentifier(identId);
        ident.name = contract.name();
        ident.description = contract.description();
        ident.save();
    }
}
