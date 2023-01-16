const crypto = require("crypto");

const generateHash = (input) => crypto.createHash("sha3-512").update(input).digest("hex");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate;

  if (event) {
    if (event.partitionKey) {
      candidate = event.partitionKey;
    } else {
      const data = JSON.stringify(event);
      candidate = generateHash(data);
    }
  }

  if (!candidate) {
    // base case for candidate
    return TRIVIAL_PARTITION_KEY;
  } else {
    if (typeof candidate === "string") {
      // return hash by determining length of candidate
      return candidate.length > MAX_PARTITION_KEY_LENGTH ? generateHash(candidate) : candidate;
    } else {
      // case: if candidate is of non-string type
      return JSON.stringify(candidate);
    }
  }
};
