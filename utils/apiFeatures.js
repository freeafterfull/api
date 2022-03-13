class apiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter = () => {
    const queryObject = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit"];

    excludeFields.forEach((el) => delete queryObject[el]);

    let queryString = JSON.stringify(queryObject);

    // gte = greater than or equal
    // lte = lesser than or equal
    // gt = greater than
    // lt = greater than
    queryString = queryString.replace(
      /\b(gte|gt|lt|lie|regex|options)\b/g,
      (match) => `$${match}`
    );

    this.query.find(JSON.parse(queryString));

    return this;
  };

  sort = () => {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  };

  paginate = () => {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  };
}

module.exports = apiFeatures;
