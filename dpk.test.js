const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns 128-length hash when given a primitive", () => {
    const result1 = deterministicPartitionKey("Inam Taj");
    expect(result1).toHaveLength(128);

    const result2 = deterministicPartitionKey("289");
    expect(result2).toHaveLength(128);
  });

  it("Returns input partition key when given object with partitionKey", () => {
    const result = deterministicPartitionKey({ partitionKey: 100 });
    expect(result).toEqual("100");
  });

  it("Returns 128-length hash when partitionKey > 256", () => {
    const result = deterministicPartitionKey({ partitionKey: new Array(300).fill('a').join('') });
    expect(result).toHaveLength(128);
  });
});
