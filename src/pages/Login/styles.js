import styled from 'styled-components'

export const ContainerLogin = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ContentLogin = styled.form`
  background: ${(props) => props.theme.white};
  width: 400px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: start;
  border-radius: 12px;
  border: none;
  padding: 50px;
`

export const Input = styled.input`
  width: 300px;
  height: 45px;
  background: ${(props) => props.theme['white-200']};
  border-radius: 6px;
  border: 1px solid ${(props) => props.theme['white-300']};
  padding: 16px;

  & + input {
    margin-top: 16px;
  }
`

export const ContentOptions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 250px;
  height: 100px;
  font-size: 13px;
  margin-top: 8px;

  div {
    display: flex;
    gap: 4px;
  }
`

export const ButtonLogin = styled.button`
  width: 180px;
  height: 60px;
  background: ${(props) => props.theme.green};
  color: ${(props) => props.theme.white};
  border: none;
  border-radius: 6px;
`

export const ButtonResetPassword = styled.span`
  cursor: ${(props) => (props.ativo ? 'pointer' : 'not-allowed')};

  &:hover {
    text-decoration: underline;
  }
`
