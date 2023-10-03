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
  flex-direction: column;
  gap: 0.1rem;
  align-items: center;
  height: 8rem;
`
export const TitleCard = styled.div`
  color: #00644e;
  font-weight: 900;
  font-size: 2.5rem;
  padding-left: 1rem;
`
export const FilterButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`
export const FilterButtons = styled.button`
  border: none;
  background-color: ${(props) =>
    props.selected === props.label ? '#f7941e' : '#00644e'};
  color: #fff;
  border-radius: 6px;
  padding: 8px;
  &:hover {
    background-color: #f7941e;
  }
`
export const ActionButtons = styled.button`
  border: none;
  cursor: pointer;
  background-color: #fff;
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
