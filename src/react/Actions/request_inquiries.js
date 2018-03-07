import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export const STORED_REQUEST_INQUIRIES = "BUNQDESKTOP_REQUEST_INQUIRIES";

export function requestInquiriesSetInfo(
    requestInquiries,
    account_id,
    resetOldItems = false,
    BunqJSClient = false
) {
    const type = resetOldItems
        ? "REQUEST_INQUIRIES_SET_INFO"
        : "REQUEST_INQUIRIES_UPDATE_INFO";

    return {
        type: type,
        payload: {
            BunqJSClient,
            requestInquiries,
            account_id
        }
    };
}

export function loadStoredRequestInquiries(BunqJSClient) {
    return dispatch => {
        BunqJSClient.Session
            .loadEncryptedData(STORED_REQUEST_INQUIRIES)
            .then(data => {
                if(data && data.items) {
                    dispatch(requestInquiriesSetInfo(data.items, data.account_id));
                }
            })
            .catch(error => {});
    };
}

export function requestInquiriesUpdate(
    BunqJSClient,
    userId,
    accountId,
    options = {
        count: 50,
        newer_id: false,
        older_id: false
    }
) {
    return dispatch => {
        dispatch(requestInquiriesLoading());
        BunqJSClient.api.requestInquiry
            .list(userId, accountId, options)
            .then(requestInquiries => {
                dispatch(
                    requestInquiriesSetInfo(
                        requestInquiries,
                        accountId,
                        false,
                        BunqJSClient
                    )
                );
                dispatch(requestInquiriesNotLoading());
            })
            .catch(error => {
                dispatch(requestInquiriesNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while sending your request inquiry"
                );
            });
    };
}

export function requestInquiriesLoading() {
    return { type: "REQUEST_INQUIRIES_IS_LOADING" };
}

export function requestInquiriesNotLoading() {
    return { type: "REQUEST_INQUIRIES_IS_NOT_LOADING" };
}

export function requestInquiriesClear() {
    return { type: "REQUEST_INQUIRIES_CLEAR" };
}
