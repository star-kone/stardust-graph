import {BigDecimal, BigInt, Bytes} from "@graphprotocol/graph-ts";

export const FACTORY_ADDRESS = "0xf2B5276d0Ae420800871Db1c6BBA777448C337B4"; // goerli
// export const FACTORY_ADDRESS = "0xc0a7eD8c1A2F401217366430D395977A2B57fc25"; // matic

export let ZERO_BD = BigDecimal.fromString('0')
export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)


export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
    if (exchangeDecimals == ZERO_BI) {
        return tokenAmount.toBigDecimal()
    }
    return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
    let bd = BigDecimal.fromString('1')
    for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
        bd = bd.times(BigDecimal.fromString('10'))
    }
    return bd
}
