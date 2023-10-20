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
  gap: 4rem;
  align-items: center;
  height: 6rem;
`
export const TitleCard = styled.div`
  color: #00644e;
  font-weight: 900;
  font-size: 2.5rem;
  padding-left: 1rem;
`
export const Input = styled.input`
  background-color: #f6f6f6;
  height: 2rem;
`
export const LabelForm = styled.label`
  font-weight: 900;
`
export const SelectForm = styled.select`
  background-color: #f6f6f6;
  height: 2rem;
  &:after {
    border-top: 6px solid #f00;
  }
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
