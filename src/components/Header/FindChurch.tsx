import { ModalContent, ModalHeader, Heading, ModalCloseButton, ModalBody, Flex, VStack } from "@chakra-ui/react"
import { Button } from "components/Button"
import { Select } from "components/Input"
import { MessageType } from "core/enums/MessageType"
import { IDenomination } from "core/models/Denomination"
import { IState as IStateResponse,ICity, ICountry } from "core/models/Location"
import { Formik, FormikProps } from "formik"
import React from "react"
import { useHistory } from "react-router-dom"
import useToast, { ToastFunc } from "utils/Toast"
import * as churchService from "core/services/church.service"
import * as utilityService from "core/services/utility.service"

interface IPropsModal {
    handleClose: () => void
  }
  
  interface IState {
    country: ICountry[]
    state: IStateResponse[]
    city: ICity[]
  }
  
  const initialChurchFormValue = {
    state:"",
    denomination:""
  }
  
  type ChurchFormType = typeof initialChurchFormValue
  

export const SearchChurch: React.FC<IPropsModal> = ({ handleClose }) => {
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
      const getCountry = async (toast: ToastFunc) => {
        try {
          return await utilityService.getCountry().then(payload => {
            const foundCountry = payload.data.find(item => item.countryID === 160)
            setLocation({
              ...location, country:
                [foundCountry as ICountry, ...payload.data.filter(item => item.countryID !== 160)]
            })
          }).then(() => {
            getState(160)
          })
        } catch (err) {
          toast({
            messageType: MessageType.WARNING,
            subtitle: "Unable to get Country"
          })
        }
      }
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
      getCountry(toast)
      getDenomination(toast)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
    const handleSubmit = (values:ChurchFormType,{...actions}:any) => {
      history.push(`/signup/member?denomination=${values.denomination}&state=${values.state}&formPart=2&login=true`)
      actions.resetForm()
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
                          <option value={item.stateID} key={item.stateID || idx} >
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
  