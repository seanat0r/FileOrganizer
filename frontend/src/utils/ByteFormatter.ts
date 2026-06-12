export class ByteFormatter {

    public static bytesToGB(value: number): number {
        return parseInt((value / (1024 ** 3)).toFixed(1));

    }

    public static bytesToMB(value: number): number {
        return parseInt((value / (1024 ** 2)).toFixed(3));
    }
}