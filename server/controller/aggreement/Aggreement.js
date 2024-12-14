const Aggrement = require("../../model/agreements/Aggrement");
const logger = require("../../utils/logger");
const { ERROR_MESSAGE } = require("../../messages/error");
const { RESPONCE_MESSAGE,  } = require("../../messages/response");
const { STATUS } = require("../../messages/status");
const { GetAndDecodeToken } = require("../../token/Tokens");
const bcrypt = require('bcrypt')
const AppError = require("../../utils/AppError");
const { BOOLEAN } = require("../../utils/Roles");



