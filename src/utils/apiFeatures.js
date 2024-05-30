class ApiFeatures {
  // queryString  => req.query
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  // ============== filtering ============== //
  filter() {
    // get a copy of req.query then delete undesired fields
    const queryFilter = { ...this.queryString };
    const toExclude = ["page", "sort", "limit", "fields", "keyword"];
    toExclude.forEach((field) => delete queryFilter[field]);

    /**   ============== filtering ( rest of operators >, <, ... ) ==============
     * Intended     => { price: { $gte: 50 }, ratingsAverage: { $gte: 4 } }
     * Got from req => { price: { gte: '50' }, ratingsAverage: { gte: '4' } }
     * So we need to make it like intended and add the $
     */
    // first make it string
    let queryStr = JSON.stringify(queryFilter);
    // then add $
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    // return whole object (so you can chain others with it)
    return this;
  }

  /* ============== sorting ============== */
  // eslint-disable-next-line
  sort() {
    if (this.queryString.sort) {
      // input => sort=price,sold
      // intended shape ex: price sold
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  /* ============== select fields (limiting fields) ============== 
      Makes it better for the frontend developer
  */
  limitFields() {
    if (this.queryString.fields) {
      // input => sort=price,sold
      // intended shape ex: price sold
      const limitBy = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(limitBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  /* ============== search ============== */
  search() {
    if (this.queryString.keyword) {
      console.log(this.queryString.keyword);
      const query = {};
      // if matches title or description | "i" => ignore case
      query.$or = [
        { title: { $regex: this.queryString.keyword, $options: "i" } },
        { description: { $regex: this.queryString.keyword, $options: "i" } },
        { name: { $regex: this.queryString.keyword, $options: "i" } },
      ];
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  // ============== pagination ============== //
  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    // end index pf current page
    const endPageIndex = page * limit;

    // Pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    if (endPageIndex < countDocuments) {
      pagination.next = page + 1;
    }

    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.paginationResult = pagination;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
