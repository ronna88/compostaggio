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
export const SearchBar = styled.div`
  input {
    height: 2rem;
    border-radius: 6px;
    border: 1px solid #dcdcdc;
    background-color: #f6f6f6;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2RjZGNkYyIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0yMjkuNjYsMjE4LjM0bC01MC4wNy01MC4wNmE4OC4xMSw4OC4xMSwwLDEsMC0xMS4zMSwxMS4zMWw1MC4wNiw1MC4wN2E4LDgsMCwwLDAsMTEuMzItMTEuMzJaTTQwLDExMmE3Miw3MiwwLDEsMSw3Miw3MkE3Mi4wOCw3Mi4wOCwwLDAsMSw0MCwxMTJaIj48L3BhdGg+PC9zdmc+');
    background-repeat: no-repeat;
    background-position: calc(1%) center;
    padding: 1.3rem; /* espaço para o ícone */
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
export const SelectLixeiraFiltrada = styled.select`
  width: 200px;
  border-color: #dcdcdc;
  background-color: #f6f6f6;
  border-radius: 6px;
  height: 2rem;
`
