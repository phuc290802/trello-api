import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARDS_TYPES } from '~/utils/constants'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'title is required (phucnguyen)',
      'string.min': 'title must be at least 3 characters long (phucnguyen)',
      'string.max': 'title must be at most 50 characters long (phucnguyen)',
      'string.trim': 'title must be trimmed (phucnguyen)',
      'string.empty': 'title is not allowed to be empty (phucnguyen)'
    }),
    description: Joi.string().required().min(3).max(255).trim().strict().messages({
      'any.required': 'description is required (phucnguyen)',
      'string.min': 'description must be at least 3 characters long (phucnguyen)',
      'string.max': 'description must be at most 255 characters long (phucnguyen)',
      'string.trim': 'description must be trimmed (phucnguyen)',
      'string.empty': 'description is not allowed to be empty (phucnguyen)'
    }),
    type: Joi.string().valid(BOARDS_TYPES.PUBLIC, BOARDS_TYPES.PRIVATE).required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
////Update no use required
const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(255).trim().strict(),
    type: Joi.string().valid(BOARDS_TYPES.PUBLIC, BOARDS_TYPES.PRIVATE),
    columnOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {
    await correctCondition.validateAsync(req.body, { 
      abortEarly: false,
      allowUnknown: true
    })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}


export const boardValidation = {
  createNew,
  update
}
