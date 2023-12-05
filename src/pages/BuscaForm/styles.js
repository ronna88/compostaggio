import styled from 'styled-components'
export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px;
`
export const Card = styled.div`
  width: 80%;
  border-radius: 20px;
  background-color: #fff;
  padding: 1rem 6rem 3rem;
`
export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  height: 6rem;
  flex-direction: column;
`
export const TitleCard = styled.div`
  color: #00644e;
  font-weight: 900;
  font-size: 2.5rem;
  padding-left: 1rem;
`
export const SubTitleCard = styled.div`
  padding-left: 1rem;
`
export const FormContent = styled.form`
  display: flex;
  flex-direction: row;
  gap: 8px;
`
export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`
export const Input = styled.input`
  display: flex;
  background-color: #f6f6f6;
  height: 2rem;
  width: 150px;
`
export const LabelForm = styled.label`
  font-weight: 900;
`
export const SaveButton = styled.button`
  border: none;
  cursor: pointer;
  background-color: #00644e;
  width: 8rem;
  height: 2rem;

  &:hover {
    color: #fff;
    background-color: #f7941e;
  }
`
export const ContainerTable = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const TableData = styled.table`
  width: 90%;
`
