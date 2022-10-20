export class Place {
  constructor(
    private readonly provider: string,
    public readonly originalId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly image: string,
    public readonly remoteness: number,
    public readonly price: number,
    public favorite: boolean
  ) {}

  public get id() {
    return this.provider + '-' + this.originalId
  }

  public isProvidedBy(providerName: string) {
    return this.provider === providerName
  }
}
