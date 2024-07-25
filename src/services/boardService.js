import { slugify } from '~/utils/formatters'
import { boardModel, findOneById } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import {cloneDeep} from 'lodash'
const createNew = async (reqBody) => {
  try{
    // handle data project
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    //create new board
    const createBoard = await boardModel.createNew(newBoard)
    //Get new board
    const getNewBoard = await boardModel.findOneById(createBoard.insertedId)
    // return new board
    return getNewBoard
  }
  catch(error){
    throw error
  }
}
const getDetails = async (boardId) => {
  try{
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND,'Board not found');
    }

    //put card in to clumn
    const resBoard = cloneDeep(board)
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
      
      // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })
    //delete card from array
    delete resBoard.cards
    return resBoard
  }
  catch(error){
    throw error
  }
}

const update = async (boardId, reqBody) => {
  try{
    const updateData= {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updateBoard = await boardModel.update(boardId, updateData)

    return updateBoard
  }
  catch(error){
    throw error
  }
}
const moveCardToDifferentColumns = async (reqBody) => {
  try{
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })
    return {updateResult: 'Successfully'}
  }
  catch(error){
    throw error
  }
}



export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumns
};