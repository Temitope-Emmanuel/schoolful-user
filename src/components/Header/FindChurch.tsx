import { ModalContent, ModalHeader, Heading, ModalCloseButton, ModalBody, Flex, VStack } from "@chakra-ui/react"
import { Button } from "components/Button"
import { Select } from "components/Input"
import { MessageType } from "core/enums/MessageType"
import { IDenomination } from "core/models/Denomination"
import { IState as IStateResponse, ICity, ICountry } from "core/models/Location"
import { Formik, FormikProps } from "formik"
import React from "react"
import { useHistory } from "react-router-dom"
import useToast, { ToastFunc } from "utils/Toast"
import * as churchService from "core/services/church.service"
import * as utilityService from "core/services/utility.service"


interface IState {
  country: ICountry[]
  state: IStateResponse[]
  city: ICity[]
}

const initialChurchFormValue = {
  state: "",
  denomination: ""
}

type ChurchFormType = typeof initialChurchFormValue

export enum RedirectType {
  home = "home",
  profile = "profile",
  noRedirect = "noRedirect"
}

export const SearchChurch: React.FC<{
  handleClose: () => void,
  getChurch?:(denominationId:number,stateId:number) => void
}> = ({ handleClose,getChurch }) => {
  const toast = useToast()
  const [denomination, setDenomination] = React.useState<IDenomination[]>([])
  const history = useHistory()
  const [location, setLocation] = React.useState<IState>({
    country: [],
    city: [],
    state: []
  })


  const getState = async (countryId: number) => {
    try {
      utilityService.getState(countryId).then(data => {
        setLocation({ ...location, state: data.data })
      })
    } catch (err) {
      toast({
        title: "Unable to get state",
        subtitle: `Error:${err}`,
        messageType: MessageType.WARNING
      })
    }
  }

  React.useEffect(() => {
    const getDenomination = async (toast: ToastFunc) => {
      try {
        return await churchService.getChurchDenomination().then(data => {
          setDenomination(data.data)
        })
      } catch (err) {
        toast({
          messageType: MessageType.WARNING,
          subtitle: "Unable to get church denomination"
        })
      }
    }
    getDenomination(toast)
    getState(160)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (values: ChurchFormType, { ...actions }: any) => {
    actions.resetForm()
    if(getChurch){
      handleClose()
      getChurch(values.denomination as any,values.state as any)
    }else {
      history.push(`/signup/member?redirect=${RedirectType.home}&denomination=${values.denomination}&state=${values.state}&formPart=2`)
    }
  }

  return (
    <ModalContent bgColor="#F3F3F3" >
      <ModalHeader color="primary" fontWeight="400" >
        <Heading fontWeight="400" mt="5" textAlign="center" fontSize="1rem">
          Please Input The Required Details
          </Heading>
      </ModalHeader>
      <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
        outline="none" borderRadius="50%" opacity={.5} />
      <ModalBody display="flex" justifyContent="center" >
        <Flex my="10" direction="column" align="center"
          flex={1} maxWidth="lg" >
          <Formik initialValues={initialChurchFormValue}
            onSubmit={handleSubmit}
          >
            {(formikProps: FormikProps<ChurchFormType>) => {
              return (
                <>
                  <VStack w="100%" >
                    <Select name="denomination" placeholder="Select Denomination" >
                      {denomination.map((item, idx) => (
                        <option value={item.denominationID} key={item.denominationID || idx} >
                          {item.denominationName}
                        </option>
                      ))}
                    </Select>
                    <Select name="state" placeholder="Select State" >
                      {location.state.map((item, idx) => (
                        <option value={item.state} key={item.state || idx} >
                          {item.name}
                        </option>
                      ))}
                    </Select>
                  </VStack>
                  <Button mt={{ sm: "5", md: "20" }} width="40%"
                    disabled={!formikProps.isValid || formikProps.isSubmitting}
                    onClick={formikProps.handleSubmit as any} role="submit"
                    bgColor="primary" color="white" >
                    Find Church
                    </Button>
                </>
              )
            }}
          </Formik>
        </Flex>
      </ModalBody>
    </ModalContent>
  )
}
